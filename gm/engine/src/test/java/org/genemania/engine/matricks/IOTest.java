/**
 * This file is part of GeneMANIA.
 * Copyright (C) 2010 University of Toronto.
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
 */

package org.genemania.engine.matricks;

import java.io.BufferedOutputStream;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.DoubleBuffer;
import java.nio.channels.FileChannel;
import junit.framework.Test;
import junit.framework.TestCase;
import junit.framework.TestSuite;

public class IOTest extends TestCase {

    /**
     * Create the test case
     *
     * @param testName name of the test case
     */
    public IOTest(String testName) {
        super(testName);
    }

    /**
     * @return the suite of tests being tested
     */
    public static Test suite() {
        return new TestSuite(IOTest.class);
    }

    /**
     * Rigourous Test :-)
     */
    public void test1() throws Exception {
        double[] data = makeRandomArray(4 * 1024 * 1024 - 10);


        long t1 = System.nanoTime();
        writeFile("target/f1.bin", data);
        long t2 = System.nanoTime();

        System.out.println("time: " + (t2 - t1));


        t1 = System.nanoTime();
        writeFile2("target/f2.bin", data, 4096);
        //writeFile3("target/f2.bin", data); //32384);
        //writeFile4("target/f2.bin", data, 32384); //32384);
        t2 = System.nanoTime();

        System.out.println("time: " + (t2 - t1));
    }

    public static double[] makeRandomArray(int len) {

        double[] array = new double[len];

        for (int i = 0; i < len; i++) {
            array[i] = java.lang.Math.random();
        }

        return array;
    }

    // dataoutput stream
    public static void writeFile(String name, double[] data) throws IOException {
        File f = new File(name);
        DataOutputStream out = new DataOutputStream(new BufferedOutputStream(new FileOutputStream(f)));

        for (int i = 0; i < data.length; i++) {
            out.writeDouble(data[i]);
        }

        out.close();
    }

    public static void writeFile2(String name, double[] data, int bufsize) throws IOException {
        int numDoubles = bufsize / 8;

        ByteBuffer b = ByteBuffer.allocate(bufsize);
        //ByteBuffer b = ByteBuffer.allocateDirect(bufsize);

        b.order(ByteOrder.BIG_ENDIAN);
        //b.order(ByteOrder.LITTLE_ENDIAN);

        FileOutputStream s = new FileOutputStream(new File(name));
        FileChannel chan = s.getChannel();
        //System.out.println("starting pos: " + chan.position());

        DoubleBuffer dataBuf = b.asDoubleBuffer();
//
//        for (int i = 0; i < data.length; i += numDoubles) {
//
//            //b.clear();
//            dataBuf.clear();
//
//            //dataBuf.put(data, i, numDoubles);
//            int z = i + numDoubles > data.length ? data.length - i : numDoubles;
//            System.out.println("writing i: " + i + " " + z + " at position " + chan.position());
//            dataBuf.put(data, i, z);
//
//            dataBuf.flip();
//            //b.flip();
//            chan.write(dataBuf.array());
//            //b.flip();
//
//        }

        chan.close();
    }

    public static void writeFile3(String name, double[] data) throws IOException {

        ByteBuffer b = ByteBuffer.allocate(data.length * 8);
        //ByteBuffer b = ByteBuffer.allocateDirect(data.length*8);

        //b.order(ByteOrder.BIG_ENDIAN);
        b.order(ByteOrder.LITTLE_ENDIAN);

        FileOutputStream s = new FileOutputStream(new File(name));
        FileChannel chan = s.getChannel();
        //System.out.println("starting pos: " + chan.position());

        DoubleBuffer dataBuf = b.asDoubleBuffer();
        dataBuf.put(data);

        chan.write(b);
        chan.close();
    }

    public static void writeFile4(String name, double[] data, int bufsize) throws IOException {
        int numDoubles = bufsize / 8;

        File f = new File(name);
        OutputStream out = new BufferedOutputStream(new FileOutputStream(f));

        ByteBuffer b = ByteBuffer.allocate(bufsize);
        //ByteBuffer b = ByteBuffer.allocateDirect(bufsize);

        b.order(ByteOrder.BIG_ENDIAN);
        //b.order(ByteOrder.LITTLE_ENDIAN);

        //System.out.println("starting pos: " + chan.position());

        DoubleBuffer dataBuf = b.asDoubleBuffer();

        for (int i = 0; i < data.length; i += numDoubles) {
            //System.out.println("writing i: " + i + " position: " + chan.position());

            //dataBuf.put(data, i, numDoubles);
            dataBuf.put(data, i, i + numDoubles > data.length ? data.length - i : numDoubles);
            out.write(b.array());
            b.flip();
            dataBuf.clear();
        }

        out.close();
    }

    public void testSmall() throws IOException {
        ByteBuffer b = ByteBuffer.allocate(64);
        //ByteBuffer b = ByteBuffer.allocateDirect(bufsize);

        b.order(ByteOrder.BIG_ENDIAN);
        //b.order(ByteOrder.LITTLE_ENDIAN);

        FileOutputStream s = new FileOutputStream(new File("target/ts.bin"));
        FileChannel chan = s.getChannel();

        b.put((byte)97);
        b.put((byte)98);
        b.flip();
        int n = chan.write(b);
        System.out.println("written: " + n);

        b.clear();
        b.put((byte)99);
        b.put((byte)100);
        b.put((byte)101);
        b.flip();
        n = chan.write(b);
        System.out.println("written: " + n);


        chan.close();

    }

}
